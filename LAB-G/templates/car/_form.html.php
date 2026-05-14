<?php
    /** @var $car ?\App\Model\Car */
?>

<div class="form-group">
    <label for="subject">Subject</label>
    <input type="text" id="subject" name="car[subject]" value="<?= $car ? $car->getSubject() : '' ?>">
</div>

<div class="form-group">
    <label for="content">Content</label>
    <textarea id="content" name="car[content]"><?= $car? $car->getContent() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
